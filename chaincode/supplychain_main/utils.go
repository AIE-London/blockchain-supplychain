package main

import (
    "fmt"
    "errors"
)

func LogAndError(errorMessage string) (error){
    fmt.Println(errorMessage)
    return errors.New(errorMessage)
}