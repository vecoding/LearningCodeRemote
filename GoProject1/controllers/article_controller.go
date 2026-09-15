package controllers

import (
	"exchangeapp/global"
	"exchangeapp/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateAtricle(c *gin.Context) {
	var atricle models.Article
	if err := c.ShouldBindJSON(&atricle); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	if err := global.Db.AutoMigrate(&atricle); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
}
