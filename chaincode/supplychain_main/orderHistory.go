package main

//==============================================================================================================================
//	OrderHistory - Defines the structure for an order history object.
//==============================================================================================================================
type OrderHistory struct {
    OrderUpdates		[]OrderUpdate	`json:"orderUpdates"`
}

type OrderUpdate struct {
    UpdateType		    string		    `json:"updateType"`
    FromValue           string          `json:"fromValue"`
    ToValue             string          `json:"toValue"`
    Comment             string          `json:"comment"`
    Updater             string          `json:"updater"`
    Timestamp           string          `json:"timestamp"`
}

const UPDATE_TYPE_SOURCE_STATUS = "SOURCE_STATUS"
const UPDATE_TYPE_TRANSPORT_STATUS = "TRANSPORT_STATUS"

func NewOrderUpdate(updateType string, fromValue string, toValue string, comment string, updater string, timestamp string) (OrderUpdate){
    var orderUpdate OrderUpdate

    orderUpdate.UpdateType = updateType
    orderUpdate.FromValue = fromValue
    orderUpdate.ToValue = toValue
    orderUpdate.Comment = comment
    orderUpdate.Updater = updater
    orderUpdate.Timestamp = timestamp

    return orderUpdate
}