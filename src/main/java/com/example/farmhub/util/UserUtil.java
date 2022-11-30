package com.example.farmhub.util;

import com.example.farmhub.models.UserModel;
import com.example.farmhub.repositories.ImageRepository;
import com.example.farmhub.repositories.UserRepository;
import com.example.farmhub.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Service
public class UserUtil implements UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    ImageRepository imageRepository;

    @Override
    public UserModel addUser(UserModel param) {
        return null;
    }
}
