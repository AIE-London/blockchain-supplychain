package main

//==============================================================================================================================
//	Order - Defines the structure for an order object.
//==============================================================================================================================
type Order struct {
    Id		            string		`json:"id"`
    Source  		    Source		`json:"source"`
    Destination	        Destination	`json:"destination"`
    Transport           Transport   `json:"transport"`
    Items               []Item      `json:"items"`
}

type Orders struct {
    Orders		        []Order		`json:"orders"`
}

type Source struct {
    Type                string      `json:"type"`
    Location            string      `json:"location"`
    Status              string      `json:"status"`
}

type Destination struct {
    Recipient           string      `json:"recipient"`
    Address             string      `json:"address"`
}

type Transport struct {
    Company             string      `json:"company"`
    Status              string      `json:"status"`
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


func NewOrder(id string, recipient string, address string, sourceLocation string, deliveryCompany string, items Items) (Order){
    var order Order

    order.Id = id
    //Hard code to warehouse source for now
    order.Source = Source{"WAREHOUSE", sourceLocation, PICK_STATUS_PENDING}
    order.Destination = Destination{recipient, address}
    order.Transport = Transport{deliveryCompany, DELIVERY_STATUS_AWAITING_PICKUP}
    order.Items = items.Items

    return order
}
