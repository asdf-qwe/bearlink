package com.project.bearlink.domain.theme.entity;

import com.project.bearlink.global.jpa.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
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
@Table(name = "theme")
public class Theme extends BaseEntity {

    private String name; // 예: "Dark", "Minimal"
    private String backgroundColor;
    private String fontColor;
}
