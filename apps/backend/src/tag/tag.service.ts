import { Injectable } from '@nestjs/common';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Tag } from './tag.entity';
import { ITagsRO } from './tag.interface';

@Injectable()
export class TagService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Tag)
    private readonly tagRepository: EntityRepository<Tag>,
  ) {}

  async findAll(): Promise<ITagsRO> {
    const tags = await this.tagRepository.findAll();
    return { tags: tags.map((tag) => tag.tag) };
  }

  async save(tagList: string[]): Promise<void> {
    let tagsData = await this.findAll();
    let tagSet = new Set(tagsData.tags);
    tagList?.map((tag) => {
      if (!tagSet.has(tag)) {
        let tagToBeSaved = new Tag();
        tagToBeSaved.tag = tag;
        this.em.persist(tagToBeSaved);
      }
    });
    await this.em.flush();
  }
}
