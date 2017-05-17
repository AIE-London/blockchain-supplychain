package main

//==============================================================================================================================
//	Organisation - Defines the structure for a organisation object.
//==============================================================================================================================
type Order struct {
    Id		            string		`json:"id"`
    Recipient		    string		`json:"recipient"`
    Address		        string	    `json:"address"`
    SourceWarehouse     string      `json:"sourceWarehouse"`
    DeliveryCompany     string      `json:"deliveryCompany"`
    Items               []Item      `json:"items"`
    PickStatus          string      `json:"pickStatus"`
    DeliveryStatus      string      `json:"deliveryStatus"`
}

type Orders struct {
    Orders		        []Order		`json:"orders"`
}
const PICK_STATUS_PENDING = "PENDING"
const PICK_STATUS_PICKED = "PICKED"
const PICK_STATUS_PARTIALLY_PICKED = "PARTIALLY_PICKED"

const DELIVERY_STATUS_AWAITING_PICKUP = "AWAITING_PICKUP"
const DELIVERY_STATUS_ENROUTE = "ENROUTE"
const DELIVERY_STATUS_DELIVERED = "DELIVERED"
const DELIVERY_STATUS_PARTIALLY_DELIVERED = "PARTIALLY_DELIVERED"
const DELIVERY_STATUS_FAILURE = "FAILURE"
const DELIVERY_STATUS_REJECTED = "REJECTED"


func NewOrder(id string, recipient string, address string, sourceWarehouse string, deliveryCompany string, items Items) (Order){
    var order Order

    order.Id = id
    order.Recipient = recipient
    order.Address = address
    order.SourceWarehouse = sourceWarehouse
    order.DeliveryCompany = deliveryCompany
    order.Items = items.Items
    order.PickStatus = PICK_STATUS_PENDING
    order.DeliveryStatus = DELIVERY_STATUS_AWAITING_PICKUP

    return order
}
