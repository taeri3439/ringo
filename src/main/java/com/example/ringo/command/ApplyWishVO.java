package com.example.ringo.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplyWishVO {
    private int applyWishId;
    private Boolean isWish;
    private Boolean isApply;
    private Integer recruitmentPostId;
    private Integer userPrimaryId;
}

