package com.example.ringo.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageVO {
    private int imgId;
    private String imgTitle;
    private byte[] imgFile;
    private Integer userPrimaryId;
    private Integer recruitmentPostId;
}

