import { nameSort, CacheHelper } from '../src/Helpers';

describe("nameSort", () => {
    it("should be sorted", () => {
        // GIVEN an
        let arrayWithNames = [{ name: "Zzz" }, { name: "Aaa" }, { name: "Jjj" }]
        // WHEN
        let sorted = nameSort(arrayWithNames);
        // THEN
        expect(sorted[0].name).toBe("Aaa");
        expect(sorted[1].name).toEqual("Jjj");
        expect(sorted[2].name).toBe("Zzz");
    })
})

describe("CacheHelper", () => {
    it("should not call execFn on registration", () => {
        // GIVEN an
        let cH = new CacheHelper
        let x = jest.fn()

        // WHEN
        cH.register("variableName", x, null)

        // THEN
        expect(x).not.toBeCalled();
    })

    it("should return variable value because execFn was called", () => {
        // GIVEN an
        let cH = new CacheHelper
        let x = jest.fn().mockReturnValue("variableValue")
        cH.register("variableName", x, null)

        // WHEN
        let result = cH.getValue("variableName")

        // THEN
        expect(x).toBeCalledTimes(1);
        expect(result).toEqual("variableValue");
    })

    it("should call execFn once when asked for the value more then once", () => {
        // GIVEN an
        let cH = new CacheHelper
        let execFn = jest.fn().mockReturnValue("variableValue")
        cH.register("variableName", execFn, null)

        // WHEN Called twice
        let result1 = cH.getValue("variableName")
        let result2 = cH.getValue("variableName")

        // THEN
        expect(execFn).toBeCalledTimes(1);
        expect(result1).toEqual("variableValue");
        expect(result2).toEqual("variableValue");
    })

    it("should return initValue when execFn returns undefined", () => {
        // GIVEN an
        let cH = new CacheHelper
        let execFn = jest.fn().mockReturnValue(undefined)
        cH.register("variableName", execFn, [])

        // WHEN
        let result = cH.getValue("variableName")

        // THEN
        expect(execFn).toBeCalledTimes(1);
        expect(result).toEqual([]);
    })

    it("should not allow registering the same variableName more then once", () => {
        // GIVEN an
        let cH = new CacheHelper
        let execFn1 = jest.fn()
        cH.register("variableName", execFn1, null)
        let execFn2 = jest.fn()

        // WHEN & THEN
        expect(() => cH.register("variableName", execFn2, null)).toThrow("VariableName 'variableName' already registered.")
    })

    it("should throw error when asking for a variable that is not registered", () => {
        // GIVEN an
        let cH = new CacheHelper

        // WHEN & THEN
        expect(() => cH.getValue("notRegistered")).toThrow("VariableName 'notRegistered' is not registered.")
    })
})