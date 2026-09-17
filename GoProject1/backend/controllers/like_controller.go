package controllers

import (
	"exchangeapp/global"
	"net/http"

	"github.com/gin-gonic/gin"
)

func LikeArticle(c *gin.Context) {
	articleID := c.Param("id")
	likeKey := "article:" + articleID + ":like"
	userName, ok := c.Get("username")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	member, err := global.RedisDB.SIsMember(likeKey, userName).Result()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if !member {
		if _, err := global.RedisDB.SAdd(likeKey, userName).Result(); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to like article"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Article liked successfully"})
	} else {
		if _, err := global.RedisDB.SRem(likeKey, userName).Result(); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unlike article"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Article unliked successfully"})
	}
}

func GetArticleLikes(c *gin.Context) {
	articleID := c.Param("id")
	likeKey := "article:" + articleID + ":like"
	userName, ok := c.Get("username")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	count, err := global.RedisDB.SCard(likeKey).Result()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	member, err := global.RedisDB.SIsMember(likeKey, userName).Result()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"likes":  count,
		"isLike": member,
	})
}
