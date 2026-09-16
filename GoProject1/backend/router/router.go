package router

import (
	"exchangeapp/controllers"
	"exchangeapp/middlewares"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()
	auth := r.Group("/api/auth")
	{
		auth.POST("/login", controllers.Login)
		auth.POST("/register", controllers.Register)
	}
	api := r.Group("/api")
	api.GET("/exchangeRates", controllers.GetExchangeRate)
	api.Use(middlewares.AuthMiddleware())
	{
		api.POST("/exchangeRates", controllers.CreateExchangeRate)

		api.GET("/articles", controllers.GetArticle)
		api.GET("/articles/:id", controllers.GetArticlesByID)
		api.POST("/articles", controllers.CreateAtricle)

		api.GET("/articles/:id/like", controllers.GetArticleLikes)
		api.POST("/articles/:id/like", controllers.LikeArticle)
	}
	return r
}
