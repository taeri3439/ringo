package com.example.ringo.notice.service;

import com.example.ringo.command.NoticeVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface NoticeService {



    List<NoticeVO> getNoticeListPaging(@Param("start") int start,
                                 @Param("amount") int amount,
                                 @Param("keyword") String keyword);

    int getTotalNoticeCount(@Param("keyword") String keyword);


}
