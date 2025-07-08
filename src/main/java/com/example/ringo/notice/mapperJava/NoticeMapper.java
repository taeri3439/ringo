package com.example.ringo.notice.mapperJava;

import com.example.ringo.command.NoticeVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface NoticeMapper {

    List<NoticeVO> getNoticeListPaging(@Param("start") int start,
                                 @Param("amount") int amount,
                                 @Param("keyword") String keyword);

    int getTotalNoticeCount(@Param("keyword") String keyword);


}
