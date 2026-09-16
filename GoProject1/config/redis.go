package config

import (
	"exchangeapp/global"
	"log"

	"github.com/go-redis/redis"
)

func initRedis() {
	redisClient := redis.NewClient(&redis.Options{
		Addr:     AppConfig.Redis.Addr,
		DB:       AppConfig.Redis.DB,
		Password: AppConfig.Redis.Password,
	})
	_, err := redisClient.Ping().Result()
	if err != nil {
		log.Fatalf("Failed to connect into struct, got error: %v", err)
	}
	global.Redis = redisClient
}
