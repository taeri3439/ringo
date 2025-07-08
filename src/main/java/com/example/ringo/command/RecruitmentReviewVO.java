package com.example.ringo.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecruitmentReviewVO {
    private int recruitmentReviewId;
    private String recruitmentReviewTitle;
    private String recruitmentReviewContent;
    private String recruitmentReviewScore;
    private Integer recruitmentPostId;
    private Integer userPrimaryId;
    private Timestamp recruitmentReviewTime;

    private String userNickName;
    private byte[] userProfile;
    private String userProfileMimetype;
    private String userProfileImage;
}

