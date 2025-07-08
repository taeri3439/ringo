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
public class NoticeVO {

    private Integer noticePostId;
    private String noticePostTitle;
    private String noticePostContent;
    private String noticePostDate;



}
