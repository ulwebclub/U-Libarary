# api

## /borrow

* `post`

* ```
    {
    	id: string
    }
    ```

## /return

* `post`

* ```
    {
    	id: string
    }
    ```

## /books

* `get`
* return all books

## /cds

* `get`
* return all cds

## /users

* `get`
* return all users

## /books/new

* `post`

* ```
    {
    	data: BookObject
    }
    ```

## /cds/new

* `post`

* ```
    {
    	data: CDObject
    }
    ```

## /users/new

* `post`

* ```
    {
    	data: UserObject
    }
    ```

## /auth

* `post`

* ```
    {
    	username: string,
    	password: string
    }
    ```

* return auth cookie

## /users/delete

* `post`

* ```
    {
    	id: string
    }
    ```

> 还有Books和CDs，都和users一样

