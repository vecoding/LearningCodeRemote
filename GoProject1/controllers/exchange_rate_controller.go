package controllers

import (
	"exchangeapp/global"
	"exchangeapp/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func CreateExchangeRate(c *gin.Context) {
	var exchangeRate models.ExchangeRate
	if err := c.ShouldBindJSON(&exchangeRate); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	exchangeRate.Date = time.Now()

	if err := global.Db.AutoMigrate(&exchangeRate); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	if err := global.Db.Create(&exchangeRate).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"exchangeRate": exchangeRate,
	})
}
func GetExchangeRate(c *gin.Context) {

}
