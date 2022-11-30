package com.example.farmhub.controllers;

import com.example.farmhub.models.UserModel;
import com.example.farmhub.repositories.UserRepository;
import com.example.farmhub.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "farmhub")
public class FarmHubController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserService userService;

    @PostMapping(value = "addNewUser")
    public UserModel addNewUser(@RequestBody UserModel param){
        UserModel user = userService.addUser(param);

        return user;
    }
}
