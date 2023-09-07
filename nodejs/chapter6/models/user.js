const Sequelize = require("sequelize");

class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init(
      {
        // 첫 번째 인수 : 컬럼 정의
        name: {
          type: Sequelize.STRING(20),
          allowNull: false,
          unique: true,
        },
        age: {
          type: Sequelize.INTEGER.UNSIGNED, // 나이가 255살을 넘지는 않을테니 TINYINT를 활용해도 좋을 듯
          allowNull: false,
        },
        married: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        comment: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE, // DATE === DATETIME(mysql), DATEONLY === DATE(mysql)
          defaultValue: Sequelize.NOW,
        },
      },
      {
        // 두 번째 인수 : 모델에 대한 설정
        sequelize,
        timestamps: false, // 기본적으로 createdAt, updatedAt를 생성해준다.(false면 우리가 직접 구현)
        underscored: false, // 시퀄라이즈 글자들에 언더바를 사용할 지  ex)created_at, updated_at
        paranoid: true, // 제거날짜 추가(deletedAt)
        modelName: "User", // 모델명 -> javascript에서 사용하는 모델명
        tableName: "Users", // 테이블명은 모델명의 복수형으로 진행한다. -> mysql에서 사용하는 모델명
        charset: "utf8mb4", // mb4는 이모티콘 사용할 수 있음
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Comment, { foreignKey: "commenter", sourceKey: "id" });
  }
}

module.exports = User;
