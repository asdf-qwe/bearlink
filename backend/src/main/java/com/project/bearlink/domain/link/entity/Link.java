package com.project.bearlink.domain.link.entity;

import com.project.bearlink.domain.category.entity.Category;
import com.project.bearlink.domain.user.user.entity.User;
import com.project.bearlink.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Table(name = "link")
public class Link extends BaseEntity {

    private String title;
    private String url;
    private String thumbnailImageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    private String price;

    @Enumerated(EnumType.STRING)
    private PreviewStatus previewStatus;
}
