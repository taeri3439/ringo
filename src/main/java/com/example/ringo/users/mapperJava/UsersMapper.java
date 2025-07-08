package com.example.ringo.users.mapperJava;

import com.example.ringo.command.UsersVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UsersMapper {
    List<UsersVO> usersVOList();
    void signup(UsersVO usersVO);
    int countByUserId(String userId); // 아이디 중복 체크용
    UsersVO login(UsersVO usersVO);
    UsersVO findByUserId(String userId); //요건 로그인 할때 아이디 존재여부 확인
    List<UsersVO> findId(UsersVO vo); // 요건 ㄹㅇ 아이디 찾기

    //비밀번호 변경할 유저 찾는거랑 변경
    UsersVO findUserForReset(UsersVO vo);
    void updatePassword(UsersVO vo);

    //회워정보 수정
    void updateUserInfo(UsersVO vo);

    Integer selectUserPrimaryIdByUserId(String userId);



}
