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
public class QnaVO {

    private int postId;
    private String postTitle;
    private String postContent;
    private Timestamp postCreateDate;
    private String postType;
    private Integer postViewCount;
    private Integer userPrimaryId;

    private String commentContent;


}



