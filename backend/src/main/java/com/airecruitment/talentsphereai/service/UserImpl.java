package com.airecruitment.talentsphereai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.airecruitment.talentsphereai.model.Users;
import com.airecruitment.talentsphereai.repo.UserRepo;

@Service
public class UserImpl implements UserServiceInterface {

    @Autowired
    private UserRepo userRepo;

    @Override
    public Users registerUser(Users user) {
        return userRepo.save(user);
    }

    @Override
    public Users getUserById(Long userId) {
        return userRepo.findById(userId).orElse(null);
    }

    @Override
    public Users updateUser(Long userId, Users user) {

        Users existingUser = userRepo.findById(userId).orElse(null);

        if (existingUser != null) {

            existingUser.setFullName(user.getFullName());
            existingUser.setEmail(user.getEmail());
            existingUser.setPassword(user.getPassword());

            return userRepo.save(existingUser);
        }

        return null;
    }

    @Override
    public void deleteUser(Long userId) {
        userRepo.deleteById(userId);
    }
}