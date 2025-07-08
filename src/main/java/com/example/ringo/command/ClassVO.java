package com.example.ringo.command;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClassVO {

    private int id;
    private String userId;
    private String roomId;
    private String title;
    private String description;
    private BigDecimal price;
    private byte[] imageUrl;
    private String imageType;
    private Timestamp createdAt;
    private String password;
    private int recruitmentPostId;
}
