import { nameSort, CacheHelper, BildrCacheHelper } from '../../src/tools/Helpers';
import { actionsJson } from "../data/actions";
import { elementsJson } from "../data/elements";
import { actionTypesJson } from "../data/actionsTypes";

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

describe("BildrCacheHelper with mock data", () => {
    beforeAll(() => {
        // INIT BildrCache with Mock data
        let bildrCache = {
            actions: JSON.parse(actionsJson),
            elements: JSON.parse(elementsJson),
            actionsTypes: JSON.parse(actionTypesJson)
        }
        const fn = jest.fn().mockReturnValue(bildrCache);
        BildrCacheHelper.bildrDBCacheGet = fn
    });

    it('should return all actions', () => {

        // WHEN
        let bCH = new BildrCacheHelper(true);
        expect(bCH.actions).toHaveLength(303)
    });

    it('should return all activeFlows', () => {
        // WHEN
        let bCH = new BildrCacheHelper(true);
        expect(bCH.activeFlows).toHaveLength(97)
    });

    it('should return all elements', () => {
        // WHEN
        let bCH = new BildrCacheHelper(true);
        expect(bCH.elements).toHaveLength(86)
    });

    it('should return all actionTypes', () => {
        // WHEN
        let bCH = new BildrCacheHelper(true);
        expect(bCH.actionTypes).toHaveLength(144)
    });

})

describe("BildrCacheHelper", () => {
    it("give an instance", () => {
        //GIVEN
        const fn = jest.fn();
        BildrCacheHelper.bildrDBCacheGet = fn

        // WHEN
        let bCH = new BildrCacheHelper(true);

        // THEN
        expect(fn).toBeCalledWith(true, "", "", null)
    });
})

describe('Find flow with actions', () => {
    
});