package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

type User struct {
	Id        int    `json:"id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
}

func main() {
	//connect to database
	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err!= nil {
        log.Fatal(err)
    }
	defer db.Close()

	// create table if not exists
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT
    );`)
    if err!= nil {
        log.Fatal(err)
    }

	// create router
    router := mux.NewRouter()

    // get all users
    router.HandleFunc("/api/users", getUsers(db)).Methods("GET")

    // get user by id
    router.HandleFunc("/api/users/{id}", getUser(db)).Methods("GET")

    // create user
    router.HandleFunc("/api/users", createUser(db)).Methods("POST")

    // update user
    router.HandleFunc("/api/users/{id}", updateUser(db)).Methods("PUT")

    // delete user
    router.HandleFunc("/api/users/{id}", deleteUser(db)).Methods("DELETE")

    // wrap the router with CORS and JSON content type middlewares
	enhancedRouter := enableCORS(jsonContentTypeMiddleware(router))

	// start the server
	log.Fatal(http.ListenAndServe(":8000", enhancedRouter))
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// allow CORS
		w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// check if the request is for CORS preflight
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// pass down the request to the next middleware or final handler
		next.ServeHTTP(w, r)
	})
}

func jsonContentTypeMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json")
        next.ServeHTTP(w, r)
    })
}

func getUsers(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
        rows, err := db.Query("SELECT id, name, email FROM users")
        if err != nil {
            log.Fatal(err)
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        defer rows.Close()

        var users []User
        for rows.Next() {
            var user User
            err := rows.Scan(&user.Id, &user.Name, &user.Email)
            if err != nil {
                log.Fatal(err)
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }
            users = append(users, user)
        }

        json.NewEncoder(w).Encode(users)
    }
}

// get user by id
func getUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
        vars := mux.Vars(r)
        id := vars["id"]

        var user User
        err := db.QueryRow("SELECT * FROM users WHERE id=$1", id).Scan(&user.Id, &user.Name, &user.Email)
        if err != nil {
            w.WriteHeader(http.StatusNotFound)
            return
        }
        json.NewEncoder(w).Encode(user)
    }
} 

// create user
func createUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
        var user User
        json.NewDecoder(r.Body).Decode(&user)

        err := db.QueryRow("INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id", user.Name, user.Email).Scan(&user.Id)
        if err!= nil {
            log.Fatal(err)
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        json.NewEncoder(w).Encode(user)
    }
}

// update user
func updateUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
        vars := mux.Vars(r)
        id := vars["id"]

        var user User
        json.NewDecoder(r.Body).Decode(&user)

        // Execute update query
        _, err := db.Exec("UPDATE users SET name=$1, email=$2 WHERE id=$3", user.Name, user.Email, id)
        if err!= nil {
            log.Fatal(err)
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        // Retrieve updated user from database
        var updatedUser User
        err = db.QueryRow("SELECT * FROM users WHERE id=$1", id).Scan(&updatedUser.Id, &updatedUser.Name, &updatedUser.Email)
        if err!= nil {
            log.Fatal(err)
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        // Send the updated user data in the response
        json.NewEncoder(w).Encode(updatedUser)
    }
}

// delete user
func deleteUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
        vars := mux.Vars(r)

        id := vars["id"]

		var user User
		err := db.QueryRow("SELECT id, name, email FROM users WHERE id = $1", id).Scan(&user.Id, &user.Name, &user.Email)

		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		} else {
			_, err = db.Exec("DELETE FROM users WHERE id = $1", id)
            if err!= nil {
                log.Fatal(err)
                w.WriteHeader(http.StatusNotFound)
                return
            }
		}

        

        json.NewEncoder(w).Encode(map[string]string{"message": "User deleted"})
    }
}