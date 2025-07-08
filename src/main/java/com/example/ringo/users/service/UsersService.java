package com.example.ringo.users.service;

import com.example.ringo.command.UsersVO;
import org.springframework.stereotype.Service;

import java.util.List;


public interface UsersService {
    List<UsersVO> usersVOList();
    void signup(UsersVO usersVO); //회원가입
    boolean isUserIdDuplicate(String userId); //아이디중복체크
    UsersVO login(UsersVO usersVO);
    List<UsersVO> findId(String userName, String userPhone);

    UsersVO findUserForReset(String userName, String userId, String userPhone);
    void updatePassword(String userId, String newPassword);

    void updateUserInfo(UsersVO vo);



}
