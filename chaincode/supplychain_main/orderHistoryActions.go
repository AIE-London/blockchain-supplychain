package main

import (
    "github.com/hyperledger/fabric/core/chaincode/shim"
)

const ORDER_HISTORY_KEY_PREFIX = "HIST"

//==============================================================================================================================
//	 Invocations
//==============================================================================================================================
func UpdateOrderHistory(stub shim.ChaincodeStubInterface, orderId string, update OrderUpdate) (error) {
    orderHistoryId := ORDER_HISTORY_KEY_PREFIX + orderId
    orderHistory, err := RetrieveOrderHistory(stub, orderHistoryId)

    if err != nil { return LogAndError("Unable to retrieve order history: " + err.Error()) }

    orderHistory.OrderUpdates = append(orderHistory.OrderUpdates, update)

    _, err = SaveOrderHistory(stub, orderHistoryId, orderHistory)
    return err
}

//==============================================================================================================================
//	 Queries
//==============================================================================================================================

func GetOrderHistory(stub shim.ChaincodeStubInterface, callerDetails CallerDetails, orderId string) (OrderHistory, bool, error) {

    //TODO Has permission to retrieve?

    orderHistory, err := RetrieveOrderHistory(stub, ORDER_HISTORY_KEY_PREFIX + orderId)

    return orderHistory, false, err
}

