package com.airecruitment.talentsphereai.service;

import com.airecruitment.talentsphereai.model.Users;

public interface UserServiceInterface {

    Users registerUser(Users user);

    Users getUserById(Long userId);

    Users updateUser(Long userId, Users user);

    void deleteUser(Long userId);
}