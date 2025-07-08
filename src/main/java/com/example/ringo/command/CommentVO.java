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
public class CommentVO {
    private int commentId;
    private String commentContent;
    private Integer commentDepth;
    private Integer commentParentId;
    private Timestamp commentCreateTime;
    private Integer postId;
    private Integer userPrimaryId;

    private String userNickName;
    private Integer childCommentCount;
}
