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
  strDrink: string;
  [key: string]: unknown;
};

const createDrink = (
  id: string,
  name: string,
  extra: Record<string, unknown> = {}
): MockDrink => ({
  idDrink: id,
  strDrink: name,
  ...extra
});

const createSuccessfulResponse = (drinks: MockDrink[]) =>
  ({
    ok: true,
    json: async () => ({ drinks })
  }) as unknown as Response;

const createEmptyResponse = () =>
  ({
    ok: true,
    json: async () => ({ drinks: null })
  }) as unknown as Response;

const createFailedResponse = () =>
  ({
    ok: false,
    json: async () => ({})
  }) as unknown as Response;

describe("GET /api/drink/search", () => {
  let fetchMock: Mock;
  let nextResponseJsonMock: ReturnType<typeof getMockedNextResponseJson>;

  beforeEach(() => {
    vi.clearAllMocks();
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    nextResponseJsonMock = getMockedNextResponseJson();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should return empty array when query parameter is missing", async () => {
    const req = new NextRequest("http://localhost:3000/api/drink/search");

    const res = await GET(req);

    expect(res).toEqual({
      data: { data: [] },
      options: { status: 200 }
    });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(nextResponseJsonMock).toHaveBeenCalledWith(
      { data: [] },
      { status: 200 }
    );
  });

  it("should return empty array when query parameter is empty", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/drink/search?query="
    );

    const res = await GET(req);

    expect(res).toEqual({
      data: { data: [] },
      options: { status: 200 }
    });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(nextResponseJsonMock).toHaveBeenCalledWith(
      { data: [] },
      { status: 200 }
    );
  });

  it("should search and return cocktails successfully", async () => {
    const mockDrinks = [
      createDrink("1", "Margarita", {
        strCategory: "Ordinary Drink",
        strAlcoholic: "Alcoholic"
      }),
      createDrink("2", "Mojito", {
        strCategory: "Cocktail",
        strAlcoholic: "Alcoholic"
      })
    ];

    fetchMock.mockResolvedValue(createSuccessfulResponse(mockDrinks));

    const req = new NextRequest(
      "http://localhost:3000/api/drink/search?query=margarita"
    );

    const res = await GET(req);

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE}/search.php?s=margarita`
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(nextResponseJsonMock).toHaveBeenCalledWith({
      data: mockDrinks
    });
  });

  it("should handle URL encoding in search query", async () => {
    const mockDrinks = [createDrink("1", "Piña Colada")];
    fetchMock.mockResolvedValue(createSuccessfulResponse(mockDrinks));

    const req = new NextRequest(
      "http://localhost:3000/api/drink/search?query=piña%20colada"
    );

    await GET(req);

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE}/search.php?s=piña colada`
    );
  });

  it("should return empty array when no drinks found", async () => {
    fetchMock.mockResolvedValue(createEmptyResponse());

    const req = new NextRequest(
      "http://localhost:3000/api/drink/search?query=nonexistent"
    );

    const res = await GET(req);

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE}/search.php?s=nonexistent`
    );
    expect(nextResponseJsonMock).toHaveBeenCalledWith({
      data: []
    });
  });

  it("should handle external API failure with 500 error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock.mockResolvedValue(createFailedResponse());

    const req = new NextRequest(
      "http://localhost:3000/api/drink/search?query=test"
    );

    try {
      const res = await GET(req);

      expect(fetchMock).toHaveBeenCalledWith(`${API_BASE}/search.php?s=test`);
      expect(consoleSpy).toHaveBeenCalled();
      expect(res).toEqual({
        data: { error: "Failed to fetch cocktails" },
        options: { status: 500 }
      });
    } finally {
      consoleSpy.mockRestore();
    }
  });

  it("should handle network errors with 500 error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock.mockRejectedValue(new Error("Network error"));

    const req = new NextRequest(
      "http://localhost:3000/api/drink/search?query=test"
    );

    try {
      const res = await GET(req);

      expect(fetchMock).toHaveBeenCalledWith(`${API_BASE}/search.php?s=test`);
      expect(consoleSpy).toHaveBeenCalled();
      expect(res).toEqual({
        data: { error: "Failed to fetch cocktails" },
        options: { status: 500 }
      });
    } finally {
      consoleSpy.mockRestore();
    }
  });

  it("should handle malformed JSON response", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => {
        throw new Error("Invalid JSON");
      }
    } as unknown as Response);

    const req = new NextRequest(
      "http://localhost:3000/api/drink/search?query=test"
    );

    try {
      const res = await GET(req);

      expect(consoleSpy).toHaveBeenCalled();
      expect(res).toEqual({
        data: { error: "Failed to fetch cocktails" },
        options: { status: 500 }
      });
    } finally {
      consoleSpy.mockRestore();
    }
  });

  it("should include expected response structure for successful search", async () => {
    const mockDrinks = [
      createDrink("123", "Old Fashioned", {
        strCategory: "Cocktail",
        strAlcoholic: "Alcoholic",
        strGlass: "Old-fashioned glass"
      })
    ];

    fetchMock.mockResolvedValue(createSuccessfulResponse(mockDrinks));

    const req = new NextRequest(
      "http://localhost:3000/api/drink/search?query=old%20fashioned"
    );

    await GET(req);

    const payload = nextResponseJsonMock.mock.calls.at(-1)?.[0] as {
      data: Cocktail[];
    };

    expect(payload.data).toHaveLength(1);
    expect(payload.data[0]).toMatchObject({
      idDrink: "123",
      strDrink: "Old Fashioned",
      strCategory: "Cocktail",
      strAlcoholic: "Alcoholic",
      strGlass: "Old-fashioned glass"
    });
  });
});
