package com.example.ringo.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostVO {
    private int postId;
    private String postTitle;
    private String postContent;
    private Timestamp postCreateDate;
    private String postType;
    private Integer postViewCount;
    private Integer userPrimaryId;

    private String userNickName;
    private Integer postCommentCount;

    private List<String> imageUrls;
    private List<MultipartFile> images;
}

