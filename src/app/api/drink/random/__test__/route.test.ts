import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Mock } from "vitest";
import { NextRequest, NextResponse } from "next/server";

import { API_BASE } from "@/constants/api";
import type { Cocktail } from "@/lib/types";

import { GET } from "../route";

vi.mock("next/server", async () => {
  const actual =
    await vi.importActual<typeof import("next/server")>("next/server");

  return {
    ...actual,
    NextResponse: {
      json: vi.fn((data, options) => ({ data, options }))
    }
  };
});

const getMockedNextResponseJson = () => NextResponse.json as unknown as Mock;

type MockDrink = {
  idDrink: string;
  [key: string]: unknown;
};

const createDrink = (
  id: string,
  extra: Record<string, unknown> = {}
): MockDrink => ({
  idDrink: id,
  strDrink: `Drink ${id}`,
  ...extra
});

const createSuccessfulResponse = (drink: MockDrink) =>
  ({
    ok: true,
    json: async () => ({ drinks: [drink] })
  }) as unknown as Response;

const createFailedResponse = () =>
  ({
    ok: false,
    json: async () => ({})
  }) as unknown as Response;

describe("GET /api/drink/random", () => {
  let fetchMock: Mock;
  let nextResponseJsonMock: ReturnType<typeof getMockedNextResponseJson>;

  beforeEach(() => {
    vi.clearAllMocks();
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    nextResponseJsonMock = getMockedNextResponseJson();
  });

  it("should return 400 if count is not between 1 and 10", async () => {
    const invalidCounts = ["0", "11"];

    for (const count of invalidCounts) {
      const req = new NextRequest(
        `http://localhost:3000/api/drink/random?count=${count}`
      );

      const res = await GET(req);

      expect(res).toEqual({
        data: { error: "Count must be between 1 and 10" },
        options: { status: 400 }
      });
    }
    expect(fetchMock).not.toHaveBeenCalled();
    expect(nextResponseJsonMock).toHaveBeenCalledTimes(2);
  });

  it.each([1, 5, 10])(
    "should fetch and return %i unique drinks for valid count",
    async (count) => {
      vi.useFakeTimers();
      let counter = 0;
      fetchMock.mockImplementation(async (input: RequestInfo | URL) => {
        const url = typeof input === "string" ? input : input.toString();
        expect(url).toBe(`${API_BASE}/random.php`);
        const drink = createDrink(`${counter++}`);
        return createSuccessfulResponse(drink);
      });

      const req = new NextRequest(
        `http://localhost:3000/api/drink/random?count=${count}`
      );
      const responsePromise = GET(req);

      await vi.runAllTimersAsync();
      const res = await responsePromise;

      expect(fetchMock).toHaveBeenCalledTimes(count);
      const payload = nextResponseJsonMock.mock.calls.at(-1)?.[0] as {
        data: { drinks: Cocktail[] };
      };
      const drinks = (
        res as unknown as { data: { data: { drinks: Cocktail[] } } }
      ).data.data.drinks;
      expect(payload.data.drinks).toHaveLength(count);
      expect(payload.data.drinks).toEqual(drinks);
      expect(new Set(drinks.map((drink) => drink.idDrink)).size).toBe(count);
    }
  );

  it("should default to 5 drinks when count query is missing", async () => {
    vi.useFakeTimers();
    let counter = 0;
    fetchMock.mockImplementation(async () =>
      createSuccessfulResponse(createDrink(`${counter++}`))
    );

    const req = new NextRequest("http://localhost:3000/api/drink/random");
    const responsePromise = GET(req);
    await vi.runAllTimersAsync();
    await responsePromise;

    expect(fetchMock).toHaveBeenCalledTimes(5);
    const payload = nextResponseJsonMock.mock.calls.at(-1)?.[0] as {
      data: { drinks: Cocktail[] };
    };
    expect(payload.data.drinks).toHaveLength(5);
    expect(payload.data.drinks.map((drink) => drink.idDrink)).toEqual([
      "0",
      "1",
      "2",
      "3",
      "4"
    ]);
  });

  it("should continue fetching when the external API fails", async () => {
    vi.useFakeTimers();
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock
      .mockResolvedValueOnce(createFailedResponse())
      .mockRejectedValueOnce(new Error("upstream down"))
      .mockResolvedValueOnce(createSuccessfulResponse(createDrink("1")))
      .mockResolvedValueOnce(createSuccessfulResponse(createDrink("2")));

    const req = new NextRequest(
      "http://localhost:3000/api/drink/random?count=2"
    );
    const responsePromise = GET(req);
    await vi.runAllTimersAsync();

    try {
      await responsePromise;

      expect(fetchMock).toHaveBeenCalledTimes(4);
      expect(consoleSpy).toHaveBeenCalled();
      const drinks = (
        nextResponseJsonMock.mock.lastCall?.[0] as {
          data: { drinks: Cocktail[] };
        }
      ).data.drinks;
      expect(drinks).toHaveLength(2);
    } finally {
      consoleSpy.mockRestore();
    }
  });

  it("should ensure returned drinks are unique even when duplicates fetched", async () => {
    vi.useFakeTimers();
    fetchMock
      .mockResolvedValueOnce(createSuccessfulResponse(createDrink("1")))
      .mockResolvedValueOnce(createSuccessfulResponse(createDrink("1")))
      .mockResolvedValueOnce(createSuccessfulResponse(createDrink("2")))
      .mockResolvedValueOnce(createSuccessfulResponse(createDrink("2")))
      .mockResolvedValueOnce(createSuccessfulResponse(createDrink("3")));

    const req = new NextRequest(
      "http://localhost:3000/api/drink/random?count=3"
    );
    const responsePromise = GET(req);
    await vi.runAllTimersAsync();
    await responsePromise;

    expect(fetchMock).toHaveBeenCalledTimes(5);
    const drinks = (
      nextResponseJsonMock.mock.lastCall?.[0] as {
        data: { drinks: Cocktail[] };
      }
    ).data.drinks;
    expect(drinks).toHaveLength(3);
    expect(new Set(drinks.map((drink) => drink.idDrink)).size).toBe(3);
  });

  it("should stop fetching when max attempts are reached", async () => {
    vi.useFakeTimers();
    fetchMock.mockResolvedValue(createSuccessfulResponse(createDrink("1")));

    const req = new NextRequest(
      "http://localhost:3000/api/drink/random?count=2"
    );
    const responsePromise = GET(req);
    await vi.runAllTimersAsync();
    await responsePromise;

    expect(fetchMock).toHaveBeenCalledTimes(10);
    const drinks = (
      nextResponseJsonMock.mock.lastCall?.[0] as {
        data: { drinks: Cocktail[] };
      }
    ).data.drinks;
    expect(drinks).toHaveLength(1);
  });

  it("should include expected response structure", async () => {
    vi.useFakeTimers();
    const drink = createDrink("42", {
      strCategory: "Mocktail",
      strAlcoholic: "Non alcoholic"
    });
    fetchMock.mockResolvedValue(createSuccessfulResponse(drink));

    const req = new NextRequest(
      "http://localhost:3000/api/drink/random?count=1"
    );
    const responsePromise = GET(req);
    await vi.runAllTimersAsync();
    await responsePromise;

    const arg = nextResponseJsonMock.mock.lastCall?.[0] as {
      data: { drinks: Cocktail[] };
    };

    expect(arg.data.drinks[0]).toMatchObject({
      idDrink: "42",
      strDrink: "Drink 42",
      strCategory: "Mocktail",
      strAlcoholic: "Non alcoholic"
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });
});
