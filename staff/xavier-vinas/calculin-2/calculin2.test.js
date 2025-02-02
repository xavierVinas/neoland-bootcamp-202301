const { expect } = require("chai")
const { add, sub, mul, div } = require ("./calculin2")
// npx mocha *.test.js para ejecutar los test 
describe("calculin2",() =>{
    describe ("add",()=>{
        it ("should add 1 + 2 and result in 3 ", () =>{
            const result = add (1,2)
            
            expect(result).to.equal(3)
        })

        it ("should add 1 + (-3) and result in -2",()=>{
            const result = add ( 1,-3)

            expect(result).to.equal(-2)
        })
    })

describe ("sub", () =>{
    it("should substract 1 - 2 and results in -1 ",()=>{
        const result = sub (1,2 )

        expect(result).to.equal(-1)
    })
})

describe("mul",() =>{
    it ("should multiply 2*3 and result in 6 ", ()=>{
        const result = mul (2,3)
        expect(result).to.equal(6)
    })
})
describe("div",()=>{
    it ("should divide 6/3 and result in 2",() =>{

        const result = div ( 6 , 3)

        expect(result).to.equal(2)
    })
})
})