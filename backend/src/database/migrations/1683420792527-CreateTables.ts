import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1683420792527 implements MigrationInterface {
  name = 'CreateTables1683420792527';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      CREATE TABLE "colors" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_9751ccb35a2b98e8b48e4baa4fe" PRIMARY KEY ("id")
      )
      `,
    );
    await queryRunner.query(
      `
      CREATE TABLE "categories" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id")
      )
      `,
    );

    await queryRunner.query(
      `
      CREATE TABLE "brands" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id")
      )
      `,
    );

    await queryRunner.query(
      `
      CREATE TABLE "products" (
        "id" SERIAL NOT NULL,
        "productStringId" character varying(100) NOT NULL,
        "priceMYR" integer NOT NULL,
        "name" character varying NOT NULL,
        "photos" text NOT NULL,
        "stockCount" integer NOT NULL,
        "brandId" integer NOT NULL,
        "categoryId" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"),
        CONSTRAINT "IDX_57ef484b3693631ee5de68b53b" UNIQUE ("productStringId"),
        CONSTRAINT "FK_ea86d0c514c4ecbb5694cbf57df" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
      `,
    );

    await queryRunner.query(
      `
      CREATE TABLE "order_history" (
        "id" SERIAL NOT NULL,
        "orderId" character varying(100) NOT NULL,
        "productStringId" character varying(100) NOT NULL,
        "priceDuringOrderMYR" integer NOT NULL,
        "photosDuringOrder" text NOT NULL,
        "nameDuringOrder" character varying NOT NULL,
        "colorDuringOrder" character varying NOT NULL,
        "status" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "REL_44ff72b554672e08774b076650" UNIQUE ("productStringId"),
        CONSTRAINT "PK_cc71513680d03ecb01b96655b0c" PRIMARY KEY ("id"),
        CONSTRAINT "IDX_e15b4a73a3e53311433968993c" UNIQUE ("orderId"),
        CONSTRAINT "FK_44ff72b554672e08774b0766501" FOREIGN KEY ("productStringId") REFERENCES "products"("productStringId") ON DELETE SET NULL ON UPDATE CASCADE
      )
      `,
    );

    await queryRunner.query(
      `
      CREATE TABLE "products_colors" (
        "productsId" integer NOT NULL,
        "colorsId" integer NOT NULL,
        CONSTRAINT "PK_da5221f174da1440f32c741ace6" PRIMARY KEY ("productsId", "colorsId"),
        CONSTRAINT "FK_7ce14c5692d5cd003d8a436a53c" FOREIGN KEY ("colorsId") REFERENCES "colors"("id") ON DELETE CASCADE ON UPDATE CASCADE
      )
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products_colors" DROP CONSTRAINT "FK_7ce14c5692d5cd003d8a436a53c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products_colors" DROP CONSTRAINT "PK_da5221f174da1440f32c741ace6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_history" DROP CONSTRAINT "FK_44ff72b554672e08774b0766501"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_history" DROP CONSTRAINT "IDX_e15b4a73a3e53311433968993c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_history" DROP CONSTRAINT "PK_cc71513680d03ecb01b96655b0c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_history" DROP CONSTRAINT "REL_44ff72b554672e08774b076650"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_ea86d0c514c4ecbb5694cbf57df"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "IDX_57ef484b3693631ee5de68b53b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "brands" DROP CONSTRAINT "PK_b0c437120b624da1034a81fc561"`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "colors" DROP CONSTRAINT "PK_9751ccb35a2b98e8b48e4baa4fe"`,
    );
    await queryRunner.query(`DROP TABLE "products_colors" CASCADE`);
    await queryRunner.query(`DROP TABLE "order_history" CASCADE`);
    await queryRunner.query(`DROP TABLE "brands" CASCADE`);
    await queryRunner.query(`DROP TABLE "products" CASCADE`);
    await queryRunner.query(`DROP TABLE "categories" CASCADE`);
    await queryRunner.query(`DROP TABLE "colors" CASCADE`);
  }
}
