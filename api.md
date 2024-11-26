# api

---

## /items

* `get`
* return all books & CDs

## /items/borrow

* `post`

* ```
    {
    	id: string,
        endTime: number
    }
    ```

* admin

## /items/return

* `post`

* ```
    {
    	id: string
    }
    ```

* admin

## /items/reserve
* `post`
* ```
    {
    	id: string
    }
    ```
* admin

## /items/new/book

* `post`

* ```
    {
    	data: BookObject
    }
    ```
* admin

## /items/new/cd

* `post`

* ```
    {
    	data: CDObject
    }
    ```
* admin

## /items/delete

* `post`

* ```
    {
    	id: string
    }
    ```
* admin

---

## /users

* `get`
* return all users
* admin

## /users/new

* `post`

* ```
    {
    	data: UserObject
    }
    ```

## /users/delete

* `post`

* ```
    {
    	id: string
    }
    ```

* admin

---

## /auth

* `post`

* ```
    {
    	username: string,
    	password: string
    }
    ```

* return auth cookie
