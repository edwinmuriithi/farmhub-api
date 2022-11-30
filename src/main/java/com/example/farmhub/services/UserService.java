package com.example.farmhub.services;

import com.example.farmhub.models.UserModel;
import org.springframework.stereotype.Component;

@Component
public interface UserService {
    UserModel addUser(UserModel param);
}
