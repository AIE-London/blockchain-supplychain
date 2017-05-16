package main

//==============================================================================================================================
//	Item - Defines the structure for an items object.
//==============================================================================================================================
type Item struct {
    Code		        string		`json:"code"`
    Description		    string		`json:"description"`
}

type Items struct {
    Items		        []Item		`json:"items"`
}

func MarshallItems(itemsRepresentation string) (Items, error){
    var items Items

    err := unmarshal([]byte(itemsRepresentation), &items)

    return items, err
}