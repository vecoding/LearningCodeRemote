package controllers

import (
	"exchangeapp/global"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis"
)

func LikeArticle(c *gin.Context) {
	articleID := c.Param("id")
	likeKey := "article:" + articleID + ":like"
	if err := global.RedisDB.Incr(likeKey).Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to like article"})
		return
	}
	c.JSON(200, gin.H{"message": "Article liked successfully"})
}
func GetArticleLikes(c *gin.Context) {
	articleID := c.Param("id")
	likeKey := "article:" + articleID + ":like"
	likes, err := global.RedisDB.Get(likeKey).Result()
	if err == redis.Nil {
		likes = "0"
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"likes": likes,
	})
}
