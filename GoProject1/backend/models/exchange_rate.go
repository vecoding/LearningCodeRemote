package models

import (
	"time"
)

type ExchangeRate struct {
	ID           uint      `json:"_id" gorm:"type:int;primaryKey"`
	FromCurrency string    `json:"fromCurrency" binding:"required"`
	ToCurrency   string    `json:"toCurrency" binding:"required"`
	Rate         float64   `json:"rate" binding:"required"`
	Date         time.Time `json:"date"`
}
