package com.example.ringo.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsersVO {
    private String userPrimaryId;
    private String userId;
    private String userPw;
    private String userName;
    private String userNickName;
    private LocalDate userBirth;
    private byte[] userProfile;  // 프로필 이미지 URL
    private Timestamp createdAt;
    private String userPhone; // 전화번호
    private String userRole; // 사용자 역할 (예: "USER", "ADMIN")
    private String userEmail;
    private String userGender;
    private int userAge;
    private String userInterest;
    private String userProfileMimeType;
    private String introductionTitle;
    private String introductionContent;

}
