import { v4 as uuidv4 } from "uuid";

import { Shop } from "./shop";

describe("Shop", () => {
  describe("openingDate(date)", () => {
    describe("and shop opening_time is not defined", () => {
      it("returns undefined", () => {
        const shop = Shop.fromJson({
          manager_id: 1,
          name: "Shop",
          uuid: uuidv4(),
          opening_days: [6],
        });
        const date = new Date("2022-04-23");

        expect(shop.openingDate(date)).toBeUndefined();
      });
    });

    describe("when shop is not open on that date", () => {
      it("returns undefined", () => {
        const shop = Shop.fromJson({
          manager_id: 1,
          name: "Shop",
          uuid: uuidv4(),
          opening_time: "08:00:00Z",
          opening_days: [0, 1, 2, 3, 4, 5],
        });
        const date = new Date("2022-04-23");

        expect(date.getDay()).toBe(6);
        expect(shop.openingDate(date)).toBeUndefined();
      });
    });

    describe("when shop is generally closed", () => {
      it("returns undefined", () => {
        const shop = Shop.fromJson({
          manager_id: 1,
          name: "Shop",
          uuid: uuidv4(),
          opening_time: "08:00:00Z",
        });
        const date = new Date("2022-04-23");

        expect(date.getDay()).toBe(6);
        expect(shop.openingDate(date)).toBeUndefined();
      });
    });

    describe("when shop is open", () => {
      it("returns opening_time as date", () => {
        const shop = Shop.fromJson({
          manager_id: 1,
          name: "Shop",
          uuid: uuidv4(),
          opening_time: "08:00:00Z",
          opening_days: [6],
        });
        const date = new Date("2022-04-23");

        expect(shop.openingDate(date)?.toISOString()).toBe(
          "2022-04-23T08:00:00.000Z"
        );
      });
    });
  });

  describe("closingDate(date)", () => {
    describe("and shop closing_time is not defined", () => {
      it("returns undefined", () => {
        const shop = Shop.fromJson({
          manager_id: 1,
          name: "Shop",
          uuid: uuidv4(),
          opening_days: [6],
        });
        const date = new Date("2022-04-23");

        expect(shop.openingDate(date)).toBeUndefined();
      });
    });

    describe("when shop is not open on that date", () => {
      it("returns undefined", () => {
        const shop = Shop.fromJson({
          manager_id: 1,
          name: "Shop",
          uuid: uuidv4(),
          closing_time: "00:00:00Z",
          opening_days: [0, 1, 2, 3, 4, 5],
        });
        const date = new Date("2022-04-23");

        expect(date.getDay()).toBe(6);
        expect(shop.closingDate(date)).toBeUndefined();
      });
    });

    describe("when shop is generally closed", () => {
      it("returns undefined", () => {
        const shop = Shop.fromJson({
          manager_id: 1,
          name: "Shop",
          uuid: uuidv4(),
          closing_time: "00:00:00Z",
        });
        const date = new Date("2022-04-23");

        expect(date.getDay()).toBe(6);
        expect(shop.closingDate(date)).toBeUndefined();
      });
    });

    describe("when shop is open", () => {
      it("returns closing_time as date", () => {
        const shop = Shop.fromJson({
          manager_id: 1,
          name: "Shop",
          uuid: uuidv4(),
          closing_time: "22:00:00Z",
          opening_days: [6],
        });
        const date = new Date("2022-04-23");

        expect(shop.closingDate(date)?.toISOString()).toBe(
          "2022-04-23T22:00:00.000Z"
        );
      });

      describe("and closing_time is in early morning (< opening_time)", () => {
        it("returns closing_time as date in next day", () => {
          const shop = Shop.fromJson({
            manager_id: 1,
            name: "Shop",
            uuid: uuidv4(),
            opening_time: "08:00:00Z",
            closing_time: "02:00:00Z",
            opening_days: [6],
          });
          const date = new Date("2022-04-23");

          expect(shop.closingDate(date)?.toISOString()).toBe(
            "2022-04-24T02:00:00.000Z"
          );
        });

        describe("and closing_time is the same as opening_time", () => {
          it("returns closing_time as date in next day (24h shops)", () => {
            const shop = Shop.fromJson({
              manager_id: 1,
              name: "Shop",
              uuid: uuidv4(),
              opening_time: "08:00:00Z",
              closing_time: "08:00:00Z",
              opening_days: [6],
            });
            const date = new Date("2022-04-23");

            expect(shop.closingDate(date)?.toISOString()).toBe(
              "2022-04-24T08:00:00.000Z"
            );
          });
        });
      });
    });
  });

  describe("isOpen(startDate, endDate)", () => {
    describe("when endDate is before than startDate", () => {
      it("returns false", () => {
        const shop = Shop.fromJson({
          manager_id: 1,
          name: "Shop",
          uuid: uuidv4(),
          opening_time: "08:00:00Z",
          closing_time: "08:00:00Z",
          opening_days: [6],
        });
        const startDate = new Date("2022-04-23T20:00:00.00Z");
        const endDate = new Date("2022-04-23T19:00:00.00Z");

        expect(shop.isOpen(startDate, endDate)).toBe(false);
      });
    });

    describe("when endDate is empty and closingDate is before than startDate", () => {
      it("returns false", () => {
        const shop = Shop.fromJson({
          manager_id: 1,
          name: "Shop",
          uuid: uuidv4(),
          opening_time: "08:00:00Z",
          closing_time: "19:00:00Z",
          opening_days: [6],
        });
        const startDate = new Date("2022-04-23T20:00:00.00Z");

        expect(shop.isOpen(startDate)).toBe(false);
      });
    });

    describe("when shop.openingDate is undefined", () => {
      it("returns false", () => {
        const shop = Shop.fromJson({
          manager_id: 1,
          name: "Shop",
          uuid: uuidv4(),
        });
        jest.spyOn(shop, "openingDate").mockReturnValueOnce(undefined);

        const startDate = new Date("2022-04-23T20:00:00.00Z");
        const endDate = new Date("2022-04-23T23:00:00.00Z");

        expect(shop.isOpen(startDate, endDate)).toBe(false);
      });
    });

    describe("when shop.closingDate is undefined", () => {
      it("returns false", () => {
        const shop = Shop.fromJson({
          manager_id: 1,
          name: "Shop",
          opening_time: "08:00:00Z",
          opening_days: [6],
        });
        jest.spyOn(shop, "closingDate").mockReturnValueOnce(undefined);

        const startDate = new Date("2022-04-23T20:00:00.00Z");
        const endDate = new Date("2022-04-23T23:00:00.00Z");

        expect(shop.isOpen(startDate, endDate)).toBe(false);
      });
    });

    describe("when startDate is before opening_time", () => {
      it("returns false", () => {
        const shop = Shop.fromJson({
          manager_id: 1,
          name: "Shop",
          opening_time: "19:00:00Z",
          closing_time: "22:00:00Z",
          opening_days: [6],
        });

        const startDate = new Date("2022-04-23T15:00:00.00Z");
        const endDate = new Date("2022-04-23T20:00:00.00Z");

        expect(shop.isOpen(startDate, endDate)).toBe(false);
      });
    });

    describe("when startDate is before closing_time", () => {
      it("returns false", () => {
        const shop = Shop.fromJson({
          manager_id: 1,
          name: "Shop",
          opening_time: "19:00:00Z",
          closing_time: "22:00:00Z",
          opening_days: [6],
        });

        const startDate = new Date("2022-04-23T23:00:00.00Z");
        const endDate = new Date("2022-04-23T23:30:00.00Z");

        expect(shop.isOpen(startDate, endDate)).toBe(false);
      });
    });

    describe("when endDate is before opening_time", () => {
      it("returns false", () => {
        const shop = Shop.fromJson({
          manager_id: 1,
          name: "Shop",
          opening_time: "19:00:00Z",
          closing_time: "22:00:00Z",
          opening_days: [6],
        });

        const startDate = new Date("2022-04-23T15:00:00.00Z");
        const endDate = new Date("2022-04-23T18:00:00.00Z");

        expect(shop.isOpen(startDate, endDate)).toBe(false);
      });
    });

    describe("when endDate is after closing_time", () => {
      it("returns false", () => {
        const shop = Shop.fromJson({
          manager_id: 1,
          name: "Shop",
          opening_time: "19:00:00Z",
          closing_time: "22:00:00Z",
          opening_days: [6],
        });

        const startDate = new Date("2022-04-23T20:00:00.00Z");
        const endDate = new Date("2022-04-23T22:30:00.00Z");

        expect(shop.isOpen(startDate, endDate)).toBe(false);
      });
    });

    describe("when startDate and endDate is between opening_time and closing_time", () => {
      it("returns true", () => {
        const shop = Shop.fromJson({
          manager_id: 1,
          name: "Shop",
          opening_time: "19:00:00Z",
          closing_time: "22:00:00Z",
          opening_days: [6],
        });

        const startDate = new Date("2022-04-23T19:30:00.00Z");
        const endDate = new Date("2022-04-23T21:30:00.00Z");

        expect(shop.isOpen(startDate, endDate)).toBe(true);
      });
    });

    describe("when startDate and endDate is for opening_time and closing_time", () => {
      it("returns true", () => {
        const shop = Shop.fromJson({
          manager_id: 1,
          name: "Shop",
          opening_time: "19:00:00Z",
          closing_time: "22:00:00Z",
          opening_days: [6],
        });

        const startDate = new Date("2022-04-23T19:00:00.00Z");
        const endDate = new Date("2022-04-23T22:00:00.00Z");

        expect(shop.isOpen(startDate, endDate)).toBe(true);
      });
    });
  });
});
