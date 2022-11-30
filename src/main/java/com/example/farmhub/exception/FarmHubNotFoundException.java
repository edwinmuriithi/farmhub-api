package com.example.farmhub.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class FarmHubNotFoundException extends RuntimeException{

    public FarmHubNotFoundException(String message){
        super(message);
    }
}
