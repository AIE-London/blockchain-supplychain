package main

//==============================================================================================================================
//	CallerDetails - Defines the structure for a callerDetails object.
//==============================================================================================================================
type CallerDetails struct {
    Username		string		`json:"username"`
    Role		    string	    `json:"role"`
}

//=================================================================================================================================
//	 newCallerDetails	-	Constructs a new caller details object
//=================================================================================================================================
func NewCallerDetails(username string, role string) (CallerDetails) {
    var callerDetails CallerDetails

    callerDetails.Username = username
    callerDetails.Role = role

    return callerDetails
}
