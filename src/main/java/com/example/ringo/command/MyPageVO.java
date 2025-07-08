package com.example.ringo.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MyPageVO {

    private Integer classManageId ;
    private String classManageStatus;
    private Timestamp classManageStartDate;
    private Timestamp classManageFinishDate;
    private Integer recruitmentPostId;
    private Integer userPrimaryId;

    private String recruitmentPostTitle;
    private String recruitmentPostContent;
    private Timestamp recruitmentPostSystime;
    private String recruitmentPostCategory;
    private Integer recruitmentPostViewcount;

    private Integer applyWishId;
    private Boolean isWish;
    private Boolean isApply;

    private Integer recruitmentReviewId;
    private String recruitmentReviewTitle;
    private String recruitmentReviewContent;
    private String recruitmentReviewScore;
    private Timestamp recruitmentReviewTime;

    private String userNickName;
    private String userProfile;
    private String userProfileMimetype;
    private byte[] userProfileBytes;

    private List<ScheduleVO> schedules;

    private String mainImageUrl;




}
