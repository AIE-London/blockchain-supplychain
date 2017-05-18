package main

import (
    "github.com/hyperledger/fabric/core/util"
    "github.com/hyperledger/fabric/core/chaincode/shim"
    "encoding/json"
    "fmt"
)

//Stored the chaincodeId of the CRUD chaincode
const CRUD_CHAINCODE_ID_KEY = "CRUD_CHAINCODE_ID"

const SAVE_FUNCTION = "save"
const RETRIEVE_FUNCTION = "retrieve"

type Dao struct {}

type IdsHolder struct {
    Ids    []string    `json:"ids"`
}

func InitDao(stub shim.ChaincodeStubInterface, crudChaincodeId string) {
    stub.PutState(CRUD_CHAINCODE_ID_KEY, []byte(crudChaincodeId))
}

func SaveOrderHistory(stub shim.ChaincodeStubInterface, id string, orderHistory OrderHistory) (OrderHistory, error) {
    err := saveObject(stub, id, orderHistory)

    return orderHistory, err
}

func RetrieveOrderHistory(stub shim.ChaincodeStubInterface, id string) (OrderHistory, error){
    var orderHistory OrderHistory

    err := retrieveObject(stub, id, &orderHistory)

    return orderHistory, err
}

func SaveOrder(stub shim.ChaincodeStubInterface, order Order) (Order, error) {
    err := saveObject(stub, order.Id, order)

    return order, err
}

func RetrieveOrder(stub shim.ChaincodeStubInterface, id string) (Order, error){
    var order Order

    err := retrieveObject(stub, id, &order)

    return order, err
}

func SaveIdsHolder(stub shim.ChaincodeStubInterface, id string, idsHolder IdsHolder) (IdsHolder, error) {
    err := saveObject(stub, id, idsHolder)

    return idsHolder, err
}

func RetrieveIdsHolder(stub shim.ChaincodeStubInterface, id string) (IdsHolder, error){
    var idsHolder IdsHolder

    err := retrieveObject(stub, id, &idsHolder)

    return idsHolder, err
}

func ClearData(stub shim.ChaincodeStubInterface) (error) {
    return invoke(stub, getCrudChaincodeId(stub), "init", []string{})
}

func retrieve(stub shim.ChaincodeStubInterface, id string) ([]byte, error) {
    return query(stub, getCrudChaincodeId(stub), RETRIEVE_FUNCTION, []string{id})
}

func retrieveObject(stub shim.ChaincodeStubInterface, id string, toStoreObject interface{}) (error){
    bytes, err := retrieve(stub, id)

    if err != nil {	fmt.Printf("RetrieveObject: Cannot retrieve object with id: " + id + " : %s", err); return err}

    err = unmarshal(bytes, toStoreObject)

    if err != nil {	fmt.Printf("RetrieveObject: Cannot unmarshall object with id: " + id + " : %s", err); return err}

    return nil
}

func saveObject(stub shim.ChaincodeStubInterface, id string, object interface{}) (error){
    bytes, err := marshall(object)

    if err != nil {fmt.Printf("\nUnable to marshall object with id: " + id + " : %s", err); return err}

    err = save(stub, id, bytes)

    if err != nil {fmt.Printf("Unable to save policy: %s",  err); return err}

    return nil
}

func save(stub shim.ChaincodeStubInterface, id string, toSave []byte) (error){
    return invoke(stub, getCrudChaincodeId(stub), SAVE_FUNCTION, []string{id, string(toSave)})
}

func invoke(stub shim.ChaincodeStubInterface, chaincodeId, functionName string, args []string) (error){
    _, error := stub.InvokeChaincode(chaincodeId, createArgs(functionName, stub.GetTxID(), args))

    return error
}

func query(stub shim.ChaincodeStubInterface, chaincodeId, functionName string, args []string) ([]byte, error){
    return stub.QueryChaincode(chaincodeId, createArgs(functionName, stub.GetTxID(), args))
}

func createArgs(functionName string, txId string, args[]string) ([][]byte){
    funcAndArgs := append([]string{functionName}, txId)
    funcAndArgs = append(funcAndArgs, args...)
    return util.ArrayToChaincodeArgs(funcAndArgs)
}

func marshall(toMarshall interface{}) ([]byte, error) {
    return json.Marshal(toMarshall)
}

func unmarshal(data []byte, object interface{}) (error){
    return json.Unmarshal(data, object)
}

func getCrudChaincodeId(stub shim.ChaincodeStubInterface) (string) {
    bytes, _ := stub.GetState(CRUD_CHAINCODE_ID_KEY)
    return string(bytes)
}
