// get funds from users
// withdraaw funds
// set a minimum funding value in usd 

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;
import "./PriceConverter.sol";

error NotOwner();

contract FundMe {

    using PriceConverter for uint256;

    // constant variables cannot be modified and costs less gas fee
    uint256 public constant MINIMUM_USD = 50 * 1e18;

    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    // immutable -> can be set inside the constructor but cannot be modified afterwards and costs less gas fee.
    address public immutable i_owner;

    AggregatorV3Interface public priceFeed;

    constructor(address priceFeedAddress) {  // will be called when deployed
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    // msg.sender -> sender of the message
    // msg.value -> number of wei send with the message
    function fund() public payable {
        require(msg.value.getConversionRate(priceFeed) >= MINIMUM_USD, "Didn't send enough!");  // 1e18 = 1*10**18
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    } 

    function withdraw() public onlyOwner {
        
        for(uint256 funderIndex=0; funderIndex<funders.length; funderIndex++){
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        } 

        // reset the array
        funders = new address[](0);

        // actually withdraw the funds

        // transfer
        // payable(msg.sender).transfer(address(this).balance);

        // send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "send failed !");

        // call
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "call failed !");
        
    }

    modifier onlyOwner {
        // require(msg.sender == i_owner, "Sender is not owner");
        if(msg.sender != i_owner) { revert NotOwner(); }
        _;    // execute the remaining code in withdraw()
    }

    // what happens if someone sends this contract ETH without calling the fund()

    receive() external payable{
        fund();
    } 

    fallback() external payable{
        fund();
    }
}