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
public class ClassManageVO {
    private int classManageId;
    private String classManageStatus;
    private Timestamp classManageStartDate;
    private Timestamp classManageFinishDate;
    private Integer recruitmentPostId;
    private Integer userPrimaryId;
    private String recruitmentPostTitle;
    private String recruitmentPostContent;
    private String mainImageUrl;
}

