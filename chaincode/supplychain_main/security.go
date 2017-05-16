package main

import (
    "fmt"
    "github.com/hyperledger/fabric/core/chaincode/shim"
    "errors"
)

const ROLE_INTERNAL_SYSTEM = "INTERNAL_SYSTEM"

//==============================================================================================================================
//	 Security Functions
//==============================================================================================================================
//	 getCallerDetails - Retrieves details about a caller from the cert
//==============================================================================================================================

func GetCallerDetails(stub shim.ChaincodeStubInterface) (CallerDetails, error){

    user, err := getUsername(stub)
    if err != nil { user = "dummy-user" }

    role, err := getRole(stub);
    if err != nil { role = "dummy-role" }

    fmt.Printf("caller_data: %s %s\n", user, role)

    return NewCallerDetails(user, role), nil
}

//==============================================================================================================================
//	 get_username - Retrieves the username of the user who invoked the chaincode from cert attributes.
//				    Returns the username as a string.
//==============================================================================================================================

func getUsername(stub shim.ChaincodeStubInterface) (string, error) {

    username, err := stub.ReadCertAttribute("username");
    if err != nil {
        fmt.Printf("Couldn't get attribute 'username'. Error: %s\n", err)
        return "", errors.New("Couldn't get attribute 'username'. Error: " + err.Error())
    }

    return string(username), nil
}

//==============================================================================================================================
//	 getRole - Retrieves the role of the user who invoked the chaincode from cert attributes.
//				    Returns the role as a string.
//==============================================================================================================================
func getRole(stub shim.ChaincodeStubInterface) (string, error) {
    affiliation, err := stub.ReadCertAttribute("role");
    if err != nil { return "", errors.New("Couldn't get attribute 'role'. Error: " + err.Error()) }
    return string(affiliation), nil
}