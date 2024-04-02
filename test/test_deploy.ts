import { assert, expect } from "chai";
import { ethers } from "hardhat";
import { SimpleStorage, SimpleStorage__factory } from "../typechain-types";

describe("SimpleStorage", function () {
  let simpleStorage: SimpleStorage;
  let SimpleStorageFactory: SimpleStorage__factory;

  beforeEach(async () => {
    SimpleStorageFactory = (await ethers.getContractFactory(
      "SimpleStorage"
    )) as SimpleStorage__factory;
    simpleStorage = await SimpleStorageFactory.deploy();
  });

  it("Should start with a favorite number of 0", async function () {
    let currentValue = await simpleStorage.retrieve();
    //expect(currentValue).to.equal(0);
    assert.equal(currentValue.toString(), "0");
  });

  it("Should update when we call store", async function () {
    let expectedValue = 7;
    let transactionResponse = await simpleStorage.store(expectedValue);
    let transactionReceipt = await transactionResponse.wait();
    let currentValue = await simpleStorage.retrieve();
    expect(currentValue).to.equal(expectedValue);
  });

    it("Should work correctly with the people struct and array", async function () {
    const expectedPersonName = "Patrick"
    const expectedFavoriteNumber = 16n // n are bigint
    const transactionResponse = await simpleStorage.addPerson(
      expectedPersonName,
      expectedFavoriteNumber
    )
    await transactionResponse.wait(1)
    const { favoriteNumber, name } = await simpleStorage.people(0)
    // We could also do it like this
    // const person = await simpleStorage.people(0)
    // const favNumber = person.favoriteNumber
    // const pName = person.name

    assert.equal(name, expectedPersonName)
    assert.equal(favoriteNumber, expectedFavoriteNumber)
  })
});
