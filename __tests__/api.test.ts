// import { getStats, ApiError } from "../lib/api";
// describe("API Tests", () => {
//   beforeEach(() => {
//     // Mock localStorage
//     Object.defineProperty(window, "localStorage", {
//       value: {
//         getItem: jest.fn(() => null),
//         setItem: jest.fn(() => null),
//       },
//       writable: true,
//     });
//   });

//   it("should return stats when API call succeeds", async () => {
//     const mockStats = {
//       /* mock stats data */
//     };

//     global.fetch = jest.fn().mockResolvedValue({
//       ok: true,
//       json: () => Promise.resolve(mockStats),
//     });

//     const result = await getStats();

//     expect(fetch).toHaveBeenCalledWith(
//       "https://api.escuelajs.co/api/v1/stats",
//       {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         next: { revalidate: 300 },
//       }
//     );
//     expect(result).toEqual(mockStats);
//   });

//   it("should throw ApiError when API call fails", async () => {
//     const mockErrorResponse = {
//       ok: false,
//       status: 500,
//       json: () => Promise.resolve({ message: "Internal Server Error" }),
//       statusText: "Internal Server Error",
//     } as Response;

//     global.fetch = jest.fn().mockResolvedValue(mockErrorResponse);

//     await expect(getStats()).rejects.toThrow(ApiError);
//     await expect(getStats()).rejects.toMatchObject({
//       status: 500,
//       message: "Internal Server Error",
//     });

//     expect(fetch).toHaveBeenCalledWith(
//       "https://api.escuelajs.co/api/v1/stats",
//       {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         next: { revalidate: 300 },
//       }
//     );
//   });
// });
import { getStats, ApiError } from "../lib/api";

describe("API Tests", () => {
  beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null),
      },
      writable: true,
    });
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should return stats when API call succeeds", async () => {
    const mockStats = {
      /* mock stats data */
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockStats),
    });

    const result = await getStats();

    expect(fetch).toHaveBeenCalledWith(
      "https://api.escuelajs.co/api/v1/stats",
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        next: { revalidate: 300 },
      }
    );
    expect(result).toEqual(mockStats);
  });

  it("should throw ApiError when API call fails", async () => {
    const mockErrorResponse = {
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: "Internal Server Error" }),
      statusText: "Internal Server Error",
    } as Response;

    global.fetch = jest.fn().mockResolvedValue(mockErrorResponse);

    await expect(getStats()).rejects.toThrow(ApiError);
    await expect(getStats()).rejects.toMatchObject({
      status: 500,
      message: "Internal Server Error",
    });

    expect(fetch).toHaveBeenCalledWith(
      "https://api.escuelajs.co/api/v1/stats",
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        next: { revalidate: 300 },
      }
    );
  });
});
